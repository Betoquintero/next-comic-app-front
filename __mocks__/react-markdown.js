// Renders the raw markdown as text: enough for tests that only check the message content.
const React = require('react');

module.exports = function ReactMarkdown({ children }) {
  return React.createElement('div', null, children);
};
