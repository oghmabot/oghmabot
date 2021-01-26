export const handleClientError = async (error: Error): Promise<void> => {
  console.error('Unexpected error.', error);
};
