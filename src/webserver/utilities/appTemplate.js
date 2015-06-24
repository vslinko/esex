export default function appTemplate(title, content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="application">${content}</div>
        <script src="/frontend.js"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            frontend.bootstrapApplication(
              document.getElementById('application')
            )
          })
        </script>
      </body>
    </html>
  `
}
