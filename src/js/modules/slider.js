import { tns } from 'tiny-slider';

export default function slider(sliderClassName) {
  tns({
    container: sliderClassName,
    items: 1,
    slideBy: 'page',
    autoplay: true,
    controls: false,
    autoplayButtonOutput: false
  });
}
