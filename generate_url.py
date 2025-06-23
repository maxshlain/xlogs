#!/usr/bin/env python3
"""
File URL Generator for Text File Editor SPA

This script compresses a text file and generates a shareable URL for the Blazor WebAssembly SPA.
The URL contains the compressed and base64-encoded file content as parameters.

Usage:
    python generate_url.py <file_path> [base_url]

Arguments:
    file_path: Path to the text file to compress and encode
    base_url: Optional base URL for the SPA (defaults to http://localhost:5000)

Example:
    python generate_url.py example.txt
    python generate_url.py example.txt https://myapp.com
"""

import argparse
import base64
import os
import sys
import urllib.parse
import zlib


def compress_and_encode(content):
    """
    Compress content using deflate and encode as base64 URL-safe string.
    
    Args:
        content (str): The text content to compress and encode
        
    Returns:
        str: Base64 URL-safe encoded compressed content
    """
    try:
        # Encode string to bytes
        content_bytes = content.encode('utf-8')
        
        # Compress using deflate (same format as JavaScript CompressionStream('deflate'))
        # Use compress() which should be compatible with DecompressionStream('deflate')
        compressed_bytes = zlib.compress(content_bytes, level=9)
        
        # Encode to base64 and make URL-safe
        encoded_content = base64.b64encode(compressed_bytes).decode('ascii')
        url_safe_content = (encoded_content
                           .replace('+', '-')
                           .replace('/', '_')
                           .replace('=', ''))
        
        return url_safe_content
    except Exception as e:
        print(f"Error compressing content: {e}", file=sys.stderr)
        sys.exit(1)


def read_file(file_path):
    """
    Read the content of a text file.
    
    Args:
        file_path (str): Path to the file to read
        
    Returns:
        str: File content as string
    """
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.", file=sys.stderr)
        sys.exit(1)
    
    if not os.path.isfile(file_path):
        print(f"Error: '{file_path}' is not a file.", file=sys.stderr)
        sys.exit(1)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except UnicodeDecodeError:
        try:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
            print(f"Warning: File encoded with latin-1, converted to UTF-8", file=sys.stderr)
            return content
        except Exception as e:
            print(f"Error reading file '{file_path}': {e}", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Error reading file '{file_path}': {e}", file=sys.stderr)
        sys.exit(1)


def generate_url(content, filename, base_url):
    """
    Generate a shareable URL with compressed content.
    
    Args:
        content (str): File content
        filename (str): Original filename
        base_url (str): Base URL of the SPA
        
    Returns:
        str: Complete URL with encoded parameters
    """
    # Compress and encode the content
    encoded_content = compress_and_encode(content)
    
    # Create URL parameters
    params = {
        'content': encoded_content,
        'compressed': '1',
        'filename': filename
    }
    
    # Build the URL
    query_string = urllib.parse.urlencode(params)
    full_url = f"{base_url}?{query_string}"
    
    return full_url


def get_file_info(file_path, content):
    """
    Get information about the file for display.
    
    Args:
        file_path (str): Path to the file
        content (str): File content
        
    Returns:
        dict: File information
    """
    file_size = len(content.encode('utf-8'))
    compressed_size = len(zlib.compress(content.encode('utf-8'), level=9))
    compression_ratio = (1 - compressed_size / file_size) * 100 if file_size > 0 else 0
    
    return {
        'name': os.path.basename(file_path),
        'size': file_size,
        'compressed_size': compressed_size,
        'compression_ratio': compression_ratio,
        'lines': len(content.splitlines())
    }


def main():
    """Main function to handle command line arguments and generate URL."""
    parser = argparse.ArgumentParser(
        description='Generate shareable URL for Text File Editor SPA',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python generate_url.py example.txt
  python generate_url.py /path/to/file.py https://myapp.com
  python generate_url.py document.md http://localhost:8080
        '''
    )
    
    parser.add_argument('file_path', 
                       help='Path to the text file to compress and encode')
    parser.add_argument('base_url', 
                       nargs='?', 
                       default='http://localhost:5000',
                       help='Base URL for the SPA (default: http://localhost:5000)')
    
    args = parser.parse_args()
    
    # Read the file
    print(f"Reading file: {args.file_path}")
    content = read_file(args.file_path)
    
    # Get file information
    filename = os.path.basename(args.file_path)
    file_info = get_file_info(args.file_path, content)
    
    # Display file information
    print(f"\nFile Information:")
    print(f"  Name: {file_info['name']}")
    print(f"  Size: {file_info['size']:,} bytes")
    print(f"  Lines: {file_info['lines']:,}")
    print(f"  Compressed size: {file_info['compressed_size']:,} bytes")
    print(f"  Compression ratio: {file_info['compression_ratio']:.1f}%")
    
    # Generate the URL
    print(f"\nGenerating URL...")
    url = generate_url(content, filename, args.base_url)
    
    print(f"\nGenerated URL:")
    print(f"Length: {len(url):,} characters")
    print(f"URL: {url}")
    
    # Check URL length and warn if too long
    if len(url) > 2048:
        print(f"\nWarning: URL is {len(url)} characters long.")
        print("Some browsers and servers may have issues with URLs longer than 2048 characters.")
        print("Consider using a smaller file or hosting the content separately.")
    
    print(f"\nURL copied to clipboard (if you want to copy manually):")
    print("=" * 50)


if __name__ == '__main__':
    main()
