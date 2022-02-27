import { Decoder, invalid, Result, string } from "@fmtk/decoders";

export const ExpectedJSON = "EXPECTED_JSON";

export function json<T>(decoder: Decoder<T>): Decoder<T> {
  return (value, opts): Result<T> => {
    const str = string(value);
    if (!str.ok) {
      return str;
    }
    try {
      value = JSON.parse(str.value);
    } catch {
      return invalid(ExpectedJSON, "expected JSON");
    }
    return decoder(value, opts);
  };
}
