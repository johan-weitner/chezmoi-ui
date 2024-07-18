import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true,
    trackHooks: true,
    logOwnerReasons: true,
  });
}
