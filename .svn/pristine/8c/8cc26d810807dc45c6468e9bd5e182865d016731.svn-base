export const loadConfig = async () => {
  const response = await fetch('/config.json'); // fetch from public folder
  if (!response.ok) throw new Error("Failed to load config.json");
  const config = await response.json();
  return config;
};
