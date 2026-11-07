import Footer from '../components/footer'
import { useEffect, useState } from 'react';
import { AlertCircle, CircleCheck, ImagePlus, Lightbulb, LoaderCircle, Upload } from 'lucide-react';
import { classifyImage, preloadClassifier } from '../lib/classifier';
import ResultsCard from '../components/ResultsCard';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function RecyclingScanner() {
  const [status, setStatus] = useState('idle'); // idle | classifying | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Start loading the model in the background when the page opens
  useEffect(() => {
    preloadClassifier().catch(() => {});
  }, []);

  // Free the preview image from memory when it changes or the page closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function processFile(file) {
    if (!file) return;

    const isHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
    if (isHeic) {
      setError('HEIC/HEIF images are not supported. Please upload a JPG or PNG.');
      setStatus('error');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Invalid file type. Please upload a JPG or PNG image.');
      setStatus('error');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Please upload an image smaller than 10 MB.');
      setStatus('error');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setStatus('classifying');
    setResult(null);
    setError('');
    try {
      setResult(await classifyImage(file));
      setStatus('done');
    } catch (err) {
      console.error(err);
      setError('Failed to classify the image. Please try again.');
      setStatus('error');
    }
  }

  function handleChange(event) {
    const file = event.target.files?.[0];
    event.target.value = ''; // reset input so same file can be re-uploaded
    processFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    if (status === 'classifying') return;
    processFile(event.dataTransfer.files?.[0]);
  }

  const busy = status === 'classifying';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 font-sans">
      {/* Body */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[28px] font-semibold leading-[34px] text-charcoal">Recycle it right.</h2>
          <p className="text-sm text-charcoal-muted">
            Add a photo to identify the material and learn how to recycle your item.
          </p>
        </div>

        {/* Upload card: click to choose a photo, or drop one here */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-dashed p-5 text-center shadow-sm transition-colors focus-within:ring-2 focus-within:ring-forest/40 ${
            busy ? 'cursor-wait' : 'cursor-pointer hover:border-forest'
          } ${dragging ? 'border-forest bg-mint-light' : 'border-mint bg-white'}`}
        >
          {previewUrl ? (
            <div className="relative w-full overflow-hidden rounded-xl bg-cream">
              <img src={previewUrl} alt="Your selected item" className="h-44 w-full object-cover" />
              {busy && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80" role="status">
                  <LoaderCircle className="size-7 animate-spin text-forest" aria-hidden="true" />
                  <span className="text-sm font-semibold text-charcoal">Identifying your item...</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex size-[52px] items-center justify-center rounded-full bg-mint-light">
                <Upload className="size-6 text-forest" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold leading-5 text-charcoal">Upload an item photo</p>
                <p className="text-[13px] leading-[18px] text-charcoal-muted">One item. One step toward less waste.</p>
              </div>
            </>
          )}

          <span
            className={`flex h-10 items-center justify-center gap-[7px] rounded-full px-6 text-[13px] font-semibold text-white transition-colors ${
              busy ? 'bg-forest/60' : 'bg-forest'
            }`}
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {previewUrl ? 'Choose another photo' : 'Choose Photo'}
          </span>
          <p className="text-[11px] leading-4 text-charcoal-muted">
            {previewUrl ? 'JPG or PNG · Up to 10 MB' : 'Or drop a photo here · JPG or PNG · Up to 10 MB'}
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            onChange={handleChange}
            disabled={busy}
          />
        </label>

        {/* Result display */}
        {status === 'error' && (
          <div
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}
        {status === 'done' && result && <ResultsCard results={result} />}

        {/* Tips */}

          <div className="flex flex-col gap-2.5 rounded-[18px] bg-white p-4 shadow-sm outline outline-[1.3px] -outline-offset-[1.3px] outline-gray-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-forest" aria-hidden="true" />
              <p className="text-sm font-semibold text-charcoal">For a better scan</p>
            </div>
            {[
            "Use good lighting and avoid glare.",
            "Keep one item in focus and fully visible.",
            "Show any labels or recycling symbols.",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2.5">
              <CircleCheck className="size-4 shrink-0 text-forest" aria-hidden="true" />
              <p className="flex-1 text-xs leading-[18px] text-charcoal-muted">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer action */}
      <Footer/>
    </div>
  );
}
