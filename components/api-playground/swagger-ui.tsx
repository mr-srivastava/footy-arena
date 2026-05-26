"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

type ApiPlaygroundSwaggerProps = {
  specUrl: string;
};

export function ApiPlaygroundSwagger({ specUrl }: ApiPlaygroundSwaggerProps) {
  return (
    <SwaggerUI
      url={specUrl}
      docExpansion="list"
      defaultModelsExpandDepth={1}
      tryItOutEnabled
    />
  );
}
