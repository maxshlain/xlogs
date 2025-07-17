using System;
using System.Collections.Generic;
using System.Collections.Generic;

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

            return ExtractJsonContent(content);
        }

        /// <summary>
        /// Extracts the JSON content from log lines by removing everything outside the curly braces
        /// and the braces themselves. Processes each line individually.
        /// </summary>
        /// <param name="content">The log content to process</param>
        /// <returns>The processed content with only JSON content between braces</returns>
        /// <exception cref="ArgumentNullException">Thrown when content is null</exception>
        public static string ExtractJsonContent(string content)
        {
            if (content == null)
                throw new ArgumentNullException(nameof(content));

            if (string.IsNullOrEmpty(content))
                return content;

            var lines = content.Split('\n');
            var processedLines = new List<string>();

            foreach (var line in lines)
            {
                var processedLine = ExtractJsonFromLine(line);
                processedLines.Add(processedLine);
            }

            return string.Join("\n", processedLines);
        }

        private static string ExtractJsonFromLine(string line)
        {
            try
            {
                var raw = ExtractJsonFromLineImpl(line) ?? "";
                // |requestId: |responseId: |eventId: 
                return raw
                    .Replace("requestId: |", "")
                    .Replace("responseId: |", "")
                    .Replace("eventId: |", "");
            }
            catch (Exception)
            {
                return line;
            }
        }

        private static string ExtractJsonFromLineImpl(string line)
        {
            if (string.IsNullOrEmpty(line))
                return line;

            int firstBraceIndex = line.IndexOf('{');
            int lastBraceIndex = line.LastIndexOf('}');

            // If we found both braces and they're in the correct order
            if (firstBraceIndex != -1 && lastBraceIndex != -1 && firstBraceIndex < lastBraceIndex)
            {
                // Extract content between braces (excluding the braces themselves)
                int startIndex = firstBraceIndex + 1;
                int length = lastBraceIndex - firstBraceIndex - 1;
                string body = line.Substring(startIndex, length);

                var bodyParts = body.Split(new[] { "message\":" }, StringSplitOptions.RemoveEmptyEntries);
                var rawMessage = bodyParts.Last();
                var rawMessageParts = rawMessage.Split(new[] { "\",\"utc_time_stamp\":" },
                    StringSplitOptions.RemoveEmptyEntries);
                var messageLeft = rawMessageParts.FirstOrDefault() ?? "";

                if (messageLeft.StartsWith("\""))
                {
                    messageLeft = messageLeft.Substring(1);
                }

                return messageLeft;
            }

            // If no valid JSON structure found, return the original line
            return line;
        }
    }
}