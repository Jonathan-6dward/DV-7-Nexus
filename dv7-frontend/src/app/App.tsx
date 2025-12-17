import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { StartProject } from './pages/StartProject';
import { TranscriptionReview } from './pages/TranscriptionReview';
import { Processing } from './pages/Processing';
import { Result } from './pages/Result';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<StartProject />} />
            <Route path="/transcription-review" element={<TranscriptionReview />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
