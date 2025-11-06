import React, { useEffect, useRef } from "react";
import { CreateOrganization } from "@clerk/clerk-react";

// Simple heuristic mapper for autocomplete values based on input name/id
const guessAutocomplete = (nameOrId) => {
  if (!nameOrId) return null;
  const s = nameOrId.toLowerCase();
  if (s.includes("email")) return "email";
  if (s.includes("org") || s.includes("organization") || s.includes("company"))
    return "organization";
  if (s.includes("first") && s.includes("name")) return "given-name";
  if (s.includes("last") && s.includes("name")) return "family-name";
  if (s === "name" || s.includes("fullname") || s.includes("full-name"))
    return "name";
  if (s.includes("username")) return "username";
  if (s.includes("phone")) return "tel";
  if (s.includes("address")) return "street-address";
  return null;
};

export default function CreateOrganizationWrapper(props) {
  const ref = useRef(null);

  useEffect(() => {
    // wait a tick for Clerk to render its internal inputs
    const id = setTimeout(() => {
      if (!ref.current) return;
      const inputs = ref.current.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        try {
          // only set if not present
          if (
            input.hasAttribute("autocomplete") &&
            input.getAttribute("autocomplete") !== ""
          )
            return;
          const name = input.getAttribute("name") || "";
          const idAttr = input.getAttribute("id") || "";
          const guessed = guessAutocomplete(name) || guessAutocomplete(idAttr);
          if (guessed) {
            input.setAttribute("autocomplete", guessed);
          } else {
            // if we can't guess, explicitly set to off to avoid browser warnings
            input.setAttribute("autocomplete", "off");
          }
        } catch (e) {
          // ignore any DOM exceptions
        }
      });
    }, 200);

    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={ref}>
      <CreateOrganization {...props} />
    </div>
  );
}
