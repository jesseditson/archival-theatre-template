// src/index.ts
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("myVideo");
  const container = document.querySelector(
    ".video-container"
  );
  const masthead = document.querySelector(".masthead");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  video.addEventListener("play", () => {
    const updateBiasLighting = () => {
      if (video.paused || video.ended) {
        masthead.style.setProperty("color", "rgba(255, 255, 255, 1)");
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const length = frame.data.length;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < length; i += 4) {
        r += frame.data[i];
        g += frame.data[i + 1];
        b += frame.data[i + 2];
      }
      r = Math.floor(r / (length / 4));
      g = Math.floor(g / (length / 4));
      b = Math.floor(b / (length / 4));
      container.style.setProperty(
        "--bias-lighting-color",
        `rgba(${r}, ${g}, ${b}, 0.5)`
      );
      if (r + g + b > 42) {
        masthead.style.setProperty("color", `rgba(${r}, ${g}, ${b}, 1)`);
      } else {
        masthead.style.setProperty("color", "rgba(14, 14, 14, 1)");
      }
      const beforeElement = document.querySelector(
        "#video-section::before"
      );
      if (beforeElement) {
        beforeElement.style.background = `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.5) 0%, rgba(0, 0, 0, 0) 70%)`;
      }
      requestAnimationFrame(updateBiasLighting);
    };
    updateBiasLighting();
  });
});
if (false) {
  console.log("Dev Mode enabled");
  new EventSource("/esbuild").addEventListener(
    "change",
    () => location.reload()
  );
}
