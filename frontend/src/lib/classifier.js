import * as ort from 'onnxruntime-web';

const MODEL_URL = '/models/greenhome_fp16.onnx';
const META_URL = '/models/model_meta.json';

// The model and its settings are loaded once and reused for each classification request.
let loadPromise = null;

function load() {
  if (!loadPromise) {
    loadPromise = (async () => {
      const [meta, session] = await Promise.all([
        fetch(META_URL).then((response) => {
          if (!response.ok) throw new Error(`Failed to load model_meta.json`);
          return response.json();
        }),
        ort.InferenceSession.create(MODEL_URL, { executionProviders: ['wasm'] }),
      ]);
      return { meta, session };
    })();

    // If loading fails, forget so that we can try again
    loadPromise.catch(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

// Call when the scanner page opens so the model is loaded in the background
export function preloadClassifier() {
  return load();
}

/**
 * Turn an image into the models input: 224x224 RGB, raw 0-255 floats, NHWC order. 
 * The image is stretched to fit (not cropped), to match the models training data. 
 */
async function toInputTensor(file, [height, width]) {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, width, height); // RGBA, 0-255
  const input = new Float32Array(height * width * 3);
  for (let i = 0, j = 0; i < data.length; i += 4) {
    input[j++] = data[i];     // R
    input[j++] = data[i + 1]; // G
    input[j++] = data[i + 2]; // B
  }
  return new ort.Tensor('float32', input, [1, height, width, 3]);
}

/**
 * Classify an image file and return the top 3 predictions with their probabilities.
 * Most likely category is first.
 * [{category: 'plastic', confidence: 0.92 }, ...]
 * confident: True if the best guess is >= threshold
 * threshold: confidence threshold for confident classification. Set in model_meta.json
 */
export async function classifyImage(file) {
  const { meta, session } = await load();
  const tensor = await toInputTensor(file, meta.input_size);

  const output = await session.run({ [session.inputNames[0]]: tensor });
  const probabilities = output[session.outputNames[0]].data; //already softmax

  const top = Array.from(probabilities, (confidence, i) => ({
    category: meta.class_names[i],
    confidence,
  }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

    return {
      top,
      confident: top[0].confidence >= meta.confidence_threshold,
      threshold: meta.confidence_threshold,
    };
}