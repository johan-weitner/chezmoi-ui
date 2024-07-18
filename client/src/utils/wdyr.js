import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const { VITE_DEBUG } = import.meta.env

if (process.env.NODE_ENV === 'development' && VITE_DEBUG === 'true') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true,
    trackHooks: true,
    logOwnerReasons: true,
  });
}
