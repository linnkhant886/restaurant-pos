interface Config {
  backofficeApiUrl: string;
}

export const config: Config = {
  backofficeApiUrl: process.env.NEXT_PUBLIC_BACKOFFICE_API_URL || "",
};
