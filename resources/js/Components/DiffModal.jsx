import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckIcon, XMarkIcon as RejectIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

export default function DiffModal({ isOpen, onClose, originalContent, newContent, explanation, onApprove, onReject }) {
    const [selectedView, setSelectedView] = useState('split'); // 'split', 'unified', 'new'

    // Simple diff algorithm to highlight changes
    const generateDiff = () => {
        const originalLines = originalContent.split('\n');
        const newLines = newContent.split('\n');
        
        const diff = [];
        let i = 0, j = 0;
        
        while (i < originalLines.length || j < newLines.length) {
            const originalLine = originalLines[i] || '';
            const newLine = newLines[j] || '';
            
            if (i >= originalLines.length) {
                // Only new lines remaining
                diff.push({ type: 'added', content: newLine, newLineNum: j + 1 });
                j++;
            } else if (j >= newLines.length) {
                // Only original lines remaining
                diff.push({ type: 'removed', content: originalLine, oldLineNum: i + 1 });
                i++;
            } else if (originalLine === newLine) {
                // Lines are the same
                diff.push({ type: 'unchanged', content: originalLine, oldLineNum: i + 1, newLineNum: j + 1 });
                i++;
                j++;
            } else {
                // Lines are different - try to find the best match
                let foundMatch = false;
                
                // Look ahead a few lines to see if we can find a match
                for (let lookahead = 1; lookahead <= 3; lookahead++) {
                    if (i + lookahead < originalLines.length && originalLines[i + lookahead] === newLine) {
                        // Found match in original, so current lines were removed
                        for (let k = 0; k < lookahead; k++) {
                            diff.push({ type: 'removed', content: originalLines[i + k], oldLineNum: i + k + 1 });
                        }
                        i += lookahead;
                        foundMatch = true;
                        break;
                    }
                    
                    if (j + lookahead < newLines.length && newLines[j + lookahead] === originalLine) {
                        // Found match in new, so current lines were added
                        for (let k = 0; k < lookahead; k++) {
                            diff.push({ type: 'added', content: newLines[j + k], newLineNum: j + k + 1 });
                        }
                        j += lookahead;
                        foundMatch = true;
                        break;
                    }
                }
                
                if (!foundMatch) {
                    // Lines are different
                    diff.push({ type: 'removed', content: originalLine, oldLineNum: i + 1 });
                    diff.push({ type: 'added', content: newLine, newLineNum: j + 1 });
                    i++;
                    j++;
                }
            }
        }
        
        return diff;
    };

    const diff = generateDiff();
    const addedLines = diff.filter(line => line.type === 'added').length;
    const removedLines = diff.filter(line => line.type === 'removed').length;
    const unchangedLines = diff.filter(line => line.type === 'unchanged').length;

    const renderSplitView = () => (
        <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded text-sm font-mono">
            {/* Original */}
            <div className="border-r border-gray-200">
                <div className="bg-red-50 px-3 py-2 border-b border-gray-200 text-red-800 font-semibold">
                    Original ({originalContent.split('\n').length} lines)
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {diff.map((line, index) => (
                        line.type !== 'added' && (
                            <div
                                key={`orig-${index}`}
                                className={`px-3 py-1 ${
                                    line.type === 'removed' ? 'bg-red-100 text-red-900' : 'bg-white'
                                }`}
                            >
                                <span className="text-gray-400 w-8 inline-block text-right mr-3">
                                    {line.oldLineNum || ''}
                                </span>
                                {line.content || ' '}
                            </div>
                        )
                    ))}
                </div>
            </div>
            
            {/* New */}
            <div>
                <div className="bg-green-50 px-3 py-2 border-b border-gray-200 text-green-800 font-semibold">
                    New ({newContent.split('\n').length} lines)
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {diff.map((line, index) => (
                        line.type !== 'removed' && (
                            <div
                                key={`new-${index}`}
                                className={`px-3 py-1 ${
                                    line.type === 'added' ? 'bg-green-100 text-green-900' : 'bg-white'
                                }`}
                            >
                                <span className="text-gray-400 w-8 inline-block text-right mr-3">
                                    {line.newLineNum || ''}
                                </span>
                                {line.content || ' '}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );

    const renderUnifiedView = () => (
        <div className="border border-gray-200 rounded text-sm font-mono">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-semibold">
                Unified Diff
            </div>
            <div className="max-h-96 overflow-y-auto">
                {diff.map((line, index) => (
                    <div
                        key={index}
                        className={`px-3 py-1 ${
                            line.type === 'added' ? 'bg-green-100 text-green-900' :
                            line.type === 'removed' ? 'bg-red-100 text-red-900' : 'bg-white'
                        }`}
                    >
                        <span className="text-gray-400 w-16 inline-block text-right mr-3">
                            {line.type === 'removed' ? `-${line.oldLineNum}` :
                             line.type === 'added' ? `+${line.newLineNum}` :
                             `${line.oldLineNum || line.newLineNum}`}
                        </span>
                        <span className={line.type === 'added' ? 'text-green-700' : line.type === 'removed' ? 'text-red-700' : ''}>
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                        </span>
                        {line.content || ' '}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderNewOnlyView = () => (
        <div className="border border-gray-200 rounded text-sm font-mono">
            <div className="bg-green-50 px-3 py-2 border-b border-gray-200 text-green-800 font-semibold">
                New Content Preview
            </div>
            <div className="max-h-96 overflow-y-auto bg-white">
                {newContent.split('\n').map((line, index) => (
                    <div key={index} className="px-3 py-1">
                        <span className="text-gray-400 w-8 inline-block text-right mr-3">
                            {index + 1}
                        </span>
                        {line || ' '}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onReject}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[90vh] flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b">
                                    <div>
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Review AI Changes
                                        </Dialog.Title>
                                        <p className="text-sm text-gray-600 mt-1">{explanation}</p>
                                    </div>
                                    <button
                                        onClick={onReject}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                    {/* Stats */}
                    <div className="px-6 py-3 bg-gray-50 border-b">
                        <div className="flex items-center space-x-6 text-sm">
                            <span className="text-green-600 font-medium">
                                +{addedLines} additions
                            </span>
                            <span className="text-red-600 font-medium">
                                -{removedLines} deletions
                            </span>
                            <span className="text-gray-600">
                                {unchangedLines} unchanged
                            </span>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="px-6 py-3 border-b">
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedView('split')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    selectedView === 'split'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Split View
                            </button>
                            <button
                                onClick={() => setSelectedView('unified')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    selectedView === 'unified'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Unified Diff
                            </button>
                            <button
                                onClick={() => setSelectedView('new')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    selectedView === 'new'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                New Content
                            </button>
                        </div>
                    </div>

                    {/* Diff Content */}
                    <div className="flex-1 overflow-hidden p-6">
                        {selectedView === 'split' && renderSplitView()}
                        {selectedView === 'unified' && renderUnifiedView()}
                        {selectedView === 'new' && renderNewOnlyView()}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onReject}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <RejectIcon className="h-4 w-4" />
                            <span>Reject Changes</span>
                        </button>
                        <button
                            onClick={onApprove}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                        >
                            <CheckIcon className="h-4 w-4" />
                            <span>Apply Changes</span>
                        </button>
                    </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}