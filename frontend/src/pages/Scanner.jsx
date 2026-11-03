import Header from '../components/header'
import Footer from '../components/footer'
import { useEffect, useState } from 'react';
import { classifyImage, preloadClassifier } from '../lib/classifier';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function RecyclingScanner() {
  const [status, setStatus] = useState('idle'); // idle | classifying | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Start loading the model in the background when the page opens
  useEffect(() => {
    preloadClassifier().catch(() => {});
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = ''; // reset input so same file can be re-uploaded
    if (!file) return;

    const isHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
    if (isHeic) {
      setError('HEIC/HEIF images are not supported. Please upload a JPG or PNG.');
      setStatus('error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload an image.');
      setStatus('error');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Please upload an image smaller than 10 MB.');
      setStatus('error');
      return;
    }

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

  return (
    <div className="flex min-h-full w-full flex-col bg-surface font-sans">
      {/* Header */}
      <Header/>
      {/* Body */}
      <main className="flex min-h-[616px] flex-col gap-5 p-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[28px] font-semibold leading-[34px] text-ink">Recycle it right.</h2>
          <p className="text-sm text-muted">
            Add a photo to identify the material and learn how to recycle your item.
          </p>
        </div>

        {/* Upload card */}
        <div className="flex h-[228px] flex-col items-center justify-center gap-2.5 rounded-[18px] bg-white p-5 outline outline-[1.3px] -outline-offset-[1.3px] outline-line-strong">
          <div className="flex size-[52px] items-center justify-center rounded-full bg-primary-soft">
            <span className="size-[19px] outline outline-[1.7px] outline-primary" /> {/* icon */}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-base font-semibold leading-5 text-ink">Upload an item photo</p>
            <p className="text-[13px] leading-[18px] text-muted">One item. One step toward less waste.</p>
          </div>
          <label className="flex h-10 cursor-pointer items-center justify-center gap-[7px] rounded-full bg-primary px-6 text-[13px] font-semibold text-white">
            <span className="size-[9px] outline outline-[1.7px] outline-white" /> {/* icon */}
            Choose Photo
            <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFile} disabled={status === 'classifying'} />
          </label>
          <p className="text-[11px] leading-4 text-muted">JPG or PNG · Up to 10 MB</p>
        </div>

        {/* Temporary result display */}
        {status === 'classifying' && (
          <p className="text-sm text-muted" role="status">Identifying your item...</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-700" role="alert">{error}</p>
        )}
        {status === 'done' && result && (
          <div className="rounded-[18px] bg-white p-4 text-sm" data-testid="result">
            <p className="font-semibold">{result.confident ? 'Confident result' : 'Not sure - top 3'}</p>
            {result.top.map(({ category, confidence }) => (
              <p key={category}>{category}: {Math.round(confidence * 100)}%</p>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="flex flex-col gap-2 rounded-[18px] bg-white p-4">
          <p className="text-sm font-semibold text-ink">For a better scan</p>
          {[
            "Use good lighting and avoid glare.",
            "Keep one item in focus and fully visible.",
            "Show any labels or recycling symbols.",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2.5">
              <span className="size-3 shrink-0 outline outline-[1.7px] outline-primary" /> {/* icon */}
              <p className="flex-1 text-xs leading-[18px] text-muted">{tip}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer action */}
      <Footer/>
    </div>
  );
}
