using TextFileEditor.Services;
using Xunit;

namespace TextFileEditor.Tests.Services
{
    public class TextProcessorTests
    {
        [Fact]
        public void PadLines_WithNullContent_ThrowsArgumentNullException()
        {
            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => TextProcessor.PadLines(null!));
        }

        [Fact]
        public void PadLines_WithEmptyString_ReturnsEmptyString()
        {
            // Arrange
            var content = "";

            // Act
            var result = TextProcessor.PadLines(content);

            // Assert
            Assert.Equal("", result);
        }

        [Fact]
        public void ExtractJsonContent_WithNullContent_ThrowsArgumentNullException()
        {
            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => TextProcessor.ExtractJsonContent(null!));
        }

        [Fact]
        public void ExtractJsonContent_WithEmptyString_ReturnsEmptyString()
        {
            // Arrange
            var content = "";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("", result);
        }

        [Fact]
        public void ExtractJsonContent_WithValidJsonLine_ExtractsContentBetweenBraces()
        {
            // Arrange
            var content = "2024-01-01 12:00:00 INFO {\"message\": \"test\", \"level\": \"info\"} end";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("\"message\": \"test\", \"level\": \"info\"", result);
        }

        [Fact]
        public void ExtractJsonContent_WithMultipleLines_ProcessesEachLineSeparately()
        {
            // Arrange
            var content = "2024-01-01 12:00:00 INFO {\"message\": \"test1\"}\n2024-01-01 12:01:00 ERROR {\"message\": \"test2\", \"error\": true}";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            var expectedResult = "\"message\": \"test1\"\n\"message\": \"test2\", \"error\": true";
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void ExtractJsonContent_WithLineWithoutBraces_ReturnsOriginalLine()
        {
            // Arrange
            var content = "This is a plain text line without JSON";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("This is a plain text line without JSON", result);
        }

        [Fact]
        public void ExtractJsonContent_WithLineWithOnlyOpeningBrace_ReturnsOriginalLine()
        {
            // Arrange
            var content = "2024-01-01 12:00:00 INFO {incomplete json";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("2024-01-01 12:00:00 INFO {incomplete json", result);
        }

        [Fact]
        public void ExtractJsonContent_WithLineWithOnlyClosingBrace_ReturnsOriginalLine()
        {
            // Arrange
            var content = "incomplete json} 2024-01-01 12:00:00 INFO";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("incomplete json} 2024-01-01 12:00:00 INFO", result);
        }

        [Fact]
        public void ExtractJsonContent_WithNestedBraces_ExtractsOutermostContent()
        {
            // Arrange
            var content = "INFO {\"data\": {\"nested\": \"value\"}, \"outer\": \"test\"} END";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("\"data\": {\"nested\": \"value\"}, \"outer\": \"test\"", result);
        }

        [Fact]
        public void ExtractJsonContent_WithEmptyBraces_ReturnsEmptyString()
        {
            // Arrange
            var content = "2024-01-01 12:00:00 INFO {} end";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("", result);
        }

        [Fact]
        public void ExtractJsonContent_WithWhitespaceOnlyLine_ReturnsWhitespace()
        {
            // Arrange
            var content = "   \t  ";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            Assert.Equal("   \t  ", result);
        }

        [Fact]
        public void ExtractJsonContent_WithMixedContent_ProcessesOnlyValidJsonLines()
        {
            // Arrange
            var content = "Plain text line\n{\"valid\": \"json\"}\nAnother plain line\n{\"another\": \"valid json\"}";

            // Act
            var result = TextProcessor.ExtractJsonContent(content);

            // Assert
            var expectedResult = "Plain text line\n\"valid\": \"json\"\nAnother plain line\n\"another\": \"valid json\"";
            Assert.Equal(expectedResult, result);
        }
    }
}
