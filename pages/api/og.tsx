import { NextRequest } from "next/server";

import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge"
};

export default function (req: NextRequest) {
  try {
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0C8.954 0 0 8.954 0 20ZM20 36C12.736 36 6.679 30.837 5.296 23.98C4.97 22.358 6.343 21 8 21H32C33.657 21 35.031 22.357 34.704 23.98C33.32 30.838 27.264 36 20 36Z"
            fill="#2563EB"
          />
          <path
            d="M45.64 30.072V29.472L45.856 29.448C46.416 29.368 46.872 29.256 47.224 29.112C47.592 28.968 47.904 28.736 48.16 28.416C48.432 28.08 48.688 27.624 48.928 27.048L54.736 12.96H55.552L61.216 27.048C61.536 27.832 61.88 28.408 62.248 28.776C62.616 29.144 63.12 29.36 63.76 29.424L64.24 29.472V30.072L61.264 30L57.424 30.072V29.472L57.904 29.424C58.464 29.36 58.864 29.24 59.104 29.064C59.344 28.888 59.464 28.64 59.464 28.32C59.464 28 59.352 27.568 59.128 27.024L57.88 23.904H51.112L49.816 27.024C49.704 27.312 49.608 27.576 49.528 27.816C49.448 28.04 49.408 28.24 49.408 28.416C49.408 28.72 49.536 28.952 49.792 29.112C50.064 29.272 50.504 29.376 51.112 29.424L51.592 29.472V30.072L48.544 30L45.64 30.072ZM51.424 23.136H57.592L54.568 15.528L51.424 23.136ZM64.8428 30.072V29.472L65.3228 29.424C65.8828 29.36 66.3068 29.28 66.5948 29.184C66.8988 29.072 67.1068 28.848 67.2188 28.512C67.3308 28.16 67.3868 27.592 67.3868 26.808V16.152C67.3868 15.352 67.3308 14.784 67.2188 14.448C67.1068 14.112 66.8988 13.896 66.5948 13.8C66.3068 13.688 65.8828 13.6 65.3228 13.536L64.8428 13.488V12.888L68.3948 12.96H68.4188L71.9708 12.888V13.488L71.4908 13.536C70.9468 13.6 70.5228 13.688 70.2188 13.8C69.9148 13.896 69.7068 14.112 69.5948 14.448C69.4828 14.784 69.4268 15.352 69.4268 16.152V26.808C69.4268 27.592 69.4828 28.16 69.5948 28.512C69.7068 28.848 69.9148 29.072 70.2188 29.184C70.5228 29.28 70.9468 29.36 71.4908 29.424L71.9708 29.472V30.072L68.4188 30H68.3948L64.8428 30.072ZM78.7969 30.264C77.7409 30.264 76.8209 30.04 76.0369 29.592C75.2529 29.128 74.6369 28.496 74.1889 27.696C73.7569 26.88 73.5409 25.952 73.5409 24.912C73.5409 23.792 73.7809 22.8 74.2609 21.936C74.7409 21.056 75.3809 20.368 76.1809 19.872C76.9969 19.36 77.8929 19.104 78.8689 19.104C80.1009 19.104 81.0609 19.496 81.7489 20.28C82.4529 21.064 82.8049 22.096 82.8049 23.376C82.8049 23.568 82.7969 23.728 82.7809 23.856C82.7649 23.984 82.7489 24.072 82.7329 24.12H75.4849C75.4689 24.344 75.4609 24.568 75.4609 24.792C75.4609 25.64 75.5969 26.432 75.8689 27.168C76.1409 27.888 76.5489 28.464 77.0929 28.896C77.6529 29.328 78.3329 29.544 79.1329 29.544C79.8849 29.544 80.5489 29.336 81.1249 28.92C81.7169 28.488 82.1729 27.856 82.4929 27.024L83.0689 27.24C82.3969 29.256 80.9729 30.264 78.7969 30.264ZM78.8689 19.704C77.8769 19.704 77.1009 20.056 76.5409 20.76C75.9969 21.464 75.6609 22.4 75.5329 23.568H78.5809C79.3009 23.568 79.8449 23.488 80.2129 23.328C80.5969 23.152 80.8529 22.944 80.9809 22.704C81.1249 22.448 81.1969 22.2 81.1969 21.96C81.1969 21.256 80.9569 20.704 80.4769 20.304C79.9969 19.904 79.4609 19.704 78.8689 19.704ZM84.5704 30.072V29.52L84.9544 29.472C85.4184 29.408 85.7704 29.336 86.0104 29.256C86.2664 29.16 86.4424 28.96 86.5384 28.656C86.6344 28.336 86.6824 27.816 86.6824 27.096V22.104C86.6824 21.48 86.5944 21.024 86.4184 20.736C86.2584 20.448 86.0184 20.272 85.6984 20.208C85.3784 20.128 85.0024 20.088 84.5704 20.088V19.536C85.2264 19.536 85.8584 19.512 86.4664 19.464C87.0744 19.416 87.7064 19.344 88.3624 19.248L88.0984 22.008H88.1944C88.5464 20.936 88.9784 20.184 89.4904 19.752C90.0024 19.32 90.5544 19.104 91.1464 19.104C91.8184 19.104 92.2664 19.272 92.4904 19.608C92.7144 19.928 92.8264 20.24 92.8264 20.544C92.8264 20.896 92.7224 21.184 92.5144 21.408C92.3064 21.632 92.0264 21.744 91.6744 21.744C91.3384 21.744 91.0824 21.664 90.9064 21.504C90.7304 21.344 90.6424 21.16 90.6424 20.952C90.6424 20.792 90.6584 20.64 90.6904 20.496C90.7384 20.352 90.7624 20.24 90.7624 20.16C90.7624 20 90.6504 19.92 90.4264 19.92C90.2024 19.92 89.9624 20.024 89.7064 20.232C89.4664 20.44 89.2584 20.728 89.0824 21.096C88.9384 21.4 88.8024 21.736 88.6744 22.104C88.5464 22.472 88.4424 22.872 88.3624 23.304V27.096C88.3624 27.816 88.4104 28.336 88.5064 28.656C88.6024 28.96 88.7704 29.16 89.0104 29.256C89.2664 29.336 89.6264 29.408 90.0904 29.472L90.4744 29.52V30.072L87.5224 30L84.5704 30.072Z"
            fill="black"
          />
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 600
    }
  );
}
