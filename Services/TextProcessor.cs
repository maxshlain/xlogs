using System;

namespace TextFileEditor.Services
{
    /// <summary>
    /// Provides text processing operations for the text editor
    /// </summary>
    public static class TextProcessor
    {
        /// <summary>
        /// Adds an additional newline after each existing newline in the text
        /// </summary>
        /// <param name="content">The text content to process</param>
        /// <returns>The processed text with padded lines</returns>
        /// <exception cref="ArgumentNullException">Thrown when content is null</exception>
        public static string PadLines(string content)
        {
            if (content == null)
                throw new ArgumentNullException(nameof(content));

            if (string.IsNullOrEmpty(content))
                return content;

            // Add an additional newline after each existing newline
            return content.Replace("\n", "\n\n");
        }
    }
}
