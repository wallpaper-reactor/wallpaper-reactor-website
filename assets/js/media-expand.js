document.addEventListener('DOMContentLoaded', function() {
  const videoItems = document.querySelectorAll('.video-item');
  const appScreenshot = document.querySelector('.app-screenshot');
  const overlay = document.getElementById('videoOverlay');
  let expandedClone = null;

  console.log('Video expand script loaded');
  console.log('Video items found:', videoItems.length);
  console.log('Overlay found:', overlay);

  function closeExpanded() {
    if (expandedClone) {
      expandedClone.classList.remove('show');
      setTimeout(() => {
        if (expandedClone && expandedClone.parentNode) {
          expandedClone.parentNode.removeChild(expandedClone);
        }
        expandedClone = null;
      }, 400);
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  videoItems.forEach(item => {
    item.addEventListener('click', function(e) {
      console.log('Video clicked!');
      e.preventDefault();
      e.stopPropagation();

      // Close if already expanded
      if (expandedClone) {
        closeExpanded();
      } else {
        // Clone the video element
        const video = this.querySelector('video');
        const clone = document.createElement('div');
        clone.className = 'video-expanded';

        const videoClone = video.cloneNode(true);
        videoClone.currentTime = video.currentTime;
        clone.appendChild(videoClone);

        document.body.appendChild(clone);
        expandedClone = clone;

        // Trigger animation
        setTimeout(() => {
          clone.classList.add('show');
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 10);

        // Click the expanded video to close
        clone.addEventListener('click', function(e) {
          e.stopPropagation();
          closeExpanded();
        });
      }
    });
  });

  // Handle app screenshot click
  if (appScreenshot) {
    appScreenshot.style.cursor = 'pointer';
    appScreenshot.addEventListener('click', function(e) {
      console.log('Screenshot clicked!');
      e.preventDefault();
      e.stopPropagation();

      // Close if already expanded
      if (expandedClone) {
        closeExpanded();
      } else {
        // Clone the image element
        const clone = document.createElement('div');
        clone.className = 'image-expanded';

        const imgClone = this.cloneNode(true);
        clone.appendChild(imgClone);

        document.body.appendChild(clone);
        expandedClone = clone;

        // Trigger animation
        setTimeout(() => {
          clone.classList.add('show');
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 10);

        // Click the expanded image to close
        clone.addEventListener('click', function(e) {
          e.stopPropagation();
          closeExpanded();
        });
      }
    });
  }

  // Click overlay to close
  if (overlay) {
    overlay.addEventListener('click', function() {
      console.log('Overlay clicked');
      closeExpanded();
    });
  }

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      console.log('ESC pressed');
      closeExpanded();
    }
  });
});
