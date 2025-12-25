import * as React from 'react';

function useHandleStreamResponse({
  onChunk,
  onFinish
}) {
  const handleStreamResponse = React.useCallback(
    async (response) => {
      try {
        if (!response || !response.body) {
          throw new Error('No response body received from the server');
        }

        const reader = response.body.getReader();
        if (!reader) {
          throw new Error('Failed to create stream reader');
        }

        const decoder = new TextDecoder();
        let content = "";
        
        while (true) {
          let readResult;
          try {
            readResult = await reader.read();
          } catch (readError) {
            console.error('Error reading stream:', readError);
            throw new Error('Error reading the response stream. Please try again.');
          }
          
          const { done, value } = readResult;
          
          if (done) {
            if (typeof onFinish === 'function') {
              onFinish(content);
            }
            break;
          }
          
          try {
            const chunk = decoder.decode(value, { stream: true });
            content += chunk;
            if (typeof onChunk === 'function') {
              onChunk(content);
            }
          } catch (decodeError) {
            console.error('Error decoding chunk:', decodeError);
            throw new Error('Error processing the response. Please try again.');
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        // If there's an error and we have content, still try to finish with what we have
        if (content && typeof onFinish === 'function') {
          onFinish(content);
        } else {
          // If no content and there was an error, rethrow to be caught by the caller
          throw error;
        }
      }
    },
    [onChunk, onFinish]
  );

  const handleStreamResponseRef = React.useRef(handleStreamResponse);
  
  React.useEffect(() => {
    handleStreamResponseRef.current = handleStreamResponse;
  }, [handleStreamResponse]);
  
  return React.useCallback((response) => {
    return handleStreamResponseRef.current(response);
  }, []); 
}

export default useHandleStreamResponse;