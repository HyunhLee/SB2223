export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
};

export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID
};

export const endPointConfig = {
  styleBot: process.env.NEXT_PUBLIC_SB_ENDPOINT,
  styleBotHandsome: process.env.NEXT_PUBLIC_SB_HANDSOME_ENDPOINT,
  styleBotBtb : process.env.NEXT_PUBLIC_SB_BTB_ENDPOINT,
  styleBotBtbImage : process.env.NEXT_PUBLIC_SB_BTB_IMAGE_NAME,
  styleBotBtbStyleImage : process.env.NEXT_PUBLIC_SB_BTB_STYLE_IMAGE_NAME
};

export const popupPreviewUrlConfig = {
  popupPreview : process.env.NEXT_PUBLIC_SB_POPUP_PREVIEW_URL,
}

export const vTonImageFileNameConfig = {
  productFile : process.env.NEXT_PUBLIC_SB_VTON_PRODUCT_IMAGE_NAME,
  userDressFile : process.env.NEXT_PUBLIC_SB_VTON_USER_IMAGE_NAME
}