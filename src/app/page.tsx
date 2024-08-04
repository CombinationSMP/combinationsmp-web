import type { NextPage } from "next";
import logo from "@/../public/assets/logo.png";
import palette from "@/styles/vars.module.scss";
import Image from "next/image";
import Button from "./_components/button";
import containerStyles from "@/styles/container.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt="CombinationSMP"
          className={containerStyles.logo}
        />
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <div
          className={containerStyles.textContainer}
          style={{
            backgroundColor: palette.tertiary + (0.2 * 255).toString(16), // alpha value
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Welcome to CombinationSMP, a modded Minecraft Survival Multiplayer experience designed for everyone! Our
            modpack features a diverse mix of mods to appeal to all types of players.
          </p>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <Button href="/modpack" openInNewTab>
              Download Modpack
            </Button>
            <Button href="/discord" openInNewTab>
              Join Discord
            </Button>
            <Button href="/apply">Apply For Whitelist</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
