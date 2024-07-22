import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';

const { VITE_DEBUG } = import.meta.env

if (process.env.NODE_ENV === 'development' && VITE_DEBUG === 'true') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true,
    trackHooks: true,
    logOwnerReasons: true,
  });
}
