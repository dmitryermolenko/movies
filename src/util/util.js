const trimText = (text, limit) => {
  let output = text.trim();
  if (output.length <= limit) {
    return output;
  }

  output = output.slice(0, limit);
  const lastSpace = output.lastIndexOf(' ');
  if (lastSpace > 0) {
    output = output.substr(0, lastSpace);
  }
  return `${output}...`;
};

export default trimText;
