import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

interface SentimentResult {
    label: string;
    score: number;
}

const SentimentAnalyzer: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [result, setResult] = useState<SentimentResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<SentimentResult[]>('http://127.0.0.1:5000/classify', { text });
            setResult(response.data[0]); // Assuming the response is an array
        } catch (error) {
            setError("Error classifying text. Please try again.");
            console.error("Error classifying text:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-6 text-blue-600">Sentiment Analyzer</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your text here..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none transition-all duration-200"
                    aria-label="Text to analyze"
                />
                <button
                    type="submit"
                    className={`flex items-center justify-center w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                    aria-live="polite"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            Loading...
                        </span>
                    ) : (
                        <>
                            <Send className="mr-2" />
                            Analyze Sentiment
                        </>
                    )}
                </button>
            </form>
            {error && (
                <div className="mt-4 text-red-500 font-semibold">{error}</div>
            )}
            {result && (
                <div className="mt-6 w-full max-w-md bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
                    <h2 className="text-xl font-semibold">Result:</h2>
                    <p className="mt-2 text-gray-700">Label: <span className="font-bold">{result.label}</span></p>
                    <p className="text-gray-700">Score: <span className="font-bold">{(result.score * 100).toFixed(2)}%</span></p>
                </div>
            )}
        </div>
    );
};

export default SentimentAnalyzer;