/* Declare the deprecated <marquee> element for GeoCities lab */
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          behavior?: string;
          direction?: string;
          scrollamount?: string;
          scrolldelay?: string;
          loop?: string;
        },
        HTMLElement
      >;
    }
  }
}
