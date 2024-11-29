import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isModalOpen: boolean = false;
  videoUrl: SafeResourceUrl | null = null;
  products = [
    {
      title: 'The Seven Deadly Sins: Wrath of the Gods',
      image: 'img/trending/trend-1.jpg',
      rating: '18 / 18',
      videoUrl: 'https://youtu.be/X3iG2mjLtLE?si=DxLxgo4Rh-ue6fkN',
      showPlayButton: false,
    },
    {
      title: 'My Hero Academia: World Heroes Mission',
      image: 'img/trending/trend-2.jpg',
      rating: '15 / 18',
      videoUrl: 'https://www.youtube.com/embed/qeQQ-Vo2w00',
      showPlayButton: false,
    },
  ];

  popularProducts = [
    {
      title: 'Popular Show 1',
      image: 'img/trending/trend-3.jpg',
      rating: '15 / 18',
      videoUrl: 'https://www.youtube.com/embed/popular-video1',
      showPlayButton: false,
    },
  ];

  // constructor(private sanitizer: DomSanitizer) {}

  // openVideo(url: string): void {
  //   this.isModalOpen = true;
  //   this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }

  // closeVideo(): void {
  //   this.isModalOpen = false;
  //   this.videoUrl = null;
  // }

  constructor(private sanitizer: DomSanitizer) {}

  // Open video modal
  openVideo(url: string): void {
    this.isModalOpen = true;
    const videoUrl = this.getVideoUrl(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    // Disable scrolling when modal is open
    document.body.classList.add('modal-open');
  }

  // Close video modal
  closeVideo(): void {
    this.isModalOpen = false;
    this.videoUrl = null;
    // Re-enable scrolling when modal is closed
    document.body.classList.remove('modal-open');
  }

  // Function to extract video ID and return correct embed URL
  getVideoUrl(url: string): string {
    let videoId: string = '';

    // Check if URL is from youtu.be or youtube.com
    if (url.includes('youtu.be')) {
      // Extract video ID from the 'youtu.be' URL
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) {
        videoId = match[1];
      }
    } else if (url.includes('youtube.com')) {
      // If the URL is already in the embed format
      const match = url.match(
        /(?:youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
      );
      if (match) {
        videoId = match[1];
      }
    }

    // Return the correct embed URL
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
