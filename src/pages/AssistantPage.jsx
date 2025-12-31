import React from 'react';
import AIAssistant from '../components/AIAssistant';
import Header from '../components/Header';

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-blue-950 pb-20">
      <Header title="AI Assistant" showBack />
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-white mb-2 px-4">Emergency Help</h1>
        <p className="text-blue-200 mb-6 px-4">
          Chat with our AI for immediate guidance on typhoon safety, emergency preparation, and disaster response.
        </p>
        <AIAssistant />
      </div>
    </div>
  );
}
