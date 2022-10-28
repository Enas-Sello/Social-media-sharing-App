import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

//conect to sanity back end
 const client = sanityClient({
   projectId: process.env.REACT_APP_SANITY_PROJECT_ID, //from sanity studio on back sanity manage
   dataset: 'production',
   useCdn: true,
   apiVersion: '2022-10-29',
   token: process.env.REACT_APP_TOKEN,
   ignoreBrowserTokenWarning: true,
 });

//work with img
const builder = imageUrlBuilder(client);

export const urlFor = ( source ) => builder.image( source )
export  default client