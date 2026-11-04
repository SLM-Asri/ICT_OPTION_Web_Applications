import { useState } from "react";
import { T } from "../lib.jsx";

export function LeaderCard({ l, ceo }) {
  const [on, setOn] = useState(false);
  const ini = l.name.startsWith("[[") ? "?" : l.name.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <div className={`flip reveal${ceo ? " ceo" : ""}${on ? " on" : ""}`} tabIndex={0} onClick={() => setOn(!on)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOn(!on))}>
      <div><div className="f"><span className="avatar">{ini}</span><h3><T>{l.name}</T></h3><p><T>{l.role}</T></p></div>
        <div className="bk"><p>{l.bio}</p><p><b>Superpower:</b> {l.power}</p>{l.quote && <p><i>"{l.quote}"</i></p>}</div></div>
    </div>
  );
}
