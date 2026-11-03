import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400">
                        Previous
                    </span>
                )}
                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400">
                        Next
                    </span>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing navigation pages
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                        {links.map((link, index) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={index}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="relative inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-200"
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`relative inline-flex items-center px-3.5 py-2 text-sm font-semibold transition ${
                                        link.active
                                            ? 'z-10 bg-[#FF5500] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5500]'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20'
                                    }`}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
