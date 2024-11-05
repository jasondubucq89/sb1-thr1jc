import React from 'react';
import { Copy, Check } from 'lucide-react';

interface ImageUrlsProps {
  imageUrl: string;
}

export function ImageUrls({ imageUrl }: ImageUrlsProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const urlTypes = [
    {
      id: 'direct',
      label: 'Direct Link',
      value: imageUrl,
      code: imageUrl
    },
    {
      id: 'html',
      label: 'HTML',
      value: `<img src="${imageUrl}" alt="Uploaded image" />`,
      code: `<img src="${imageUrl}" alt="Uploaded image" />`
    },
    {
      id: 'markdown',
      label: 'Markdown',
      value: `![Uploaded image](${imageUrl})`,
      code: `![Uploaded image](${imageUrl})`
    },
    {
      id: 'bbcode',
      label: 'BBCode',
      value: `[img]${imageUrl}[/img]`,
      code: `[img]${imageUrl}[/img]`
    }
  ];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-orange-200">
      <h3 className="font-semibold text-gray-700 mb-4">Integration URLs</h3>
      <div className="space-y-3">
        {urlTypes.map((type) => (
          <div key={type.id} className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {type.label}
            </label>
            <div className="flex">
              <code className="flex-1 p-2 bg-white border border-r-0 border-orange-200 rounded-l-md text-sm overflow-x-auto">
                {type.code}
              </code>
              <button
                onClick={() => copyToClipboard(type.value, type.id)}
                className="px-3 bg-orange-100 border border-orange-200 rounded-r-md hover:bg-orange-200 transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === type.id ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-orange-600" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}