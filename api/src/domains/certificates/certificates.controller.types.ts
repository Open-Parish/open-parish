export type CertificateRouteType =
  | "baptismal"
  | "confirmation"
  | "death"
  | "marriage";

export type CertificateStorage = {
  table: "births" | "deaths" | "marriages";
  certificateType: CertificateRouteType;
};
