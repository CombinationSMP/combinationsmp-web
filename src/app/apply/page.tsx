import type { NextPage } from "next";
import containerStyles from "@/styles/container.module.scss";
import FormItem from "../_components/FormItem";
import TextInput from "../_components/FormItem/text";
import palette from "@/styles/vars.module.scss";
import SubmitButton from "../_components/FormItem/submit";
import MCUsername from "./_mcusername";

const Apply: NextPage = () => {
  return (
    <div
      className={containerStyles.textContainer}
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "1rem",
        backdropFilter: "blur(10px) brightness(80%)",
        padding: "2rem",
        maxWidth: "70vw",
        textAlign: "left",
        backgroundColor: palette.tertiary + (0.2 * 255).toString(16), // alpha value
      }}
    >
      <h1>Apply For Whitelist</h1>
      <p>
        <span style={{ color: "#ff0000" }}>*</span> = required
      </p>
      <form style={{ width: "100%" }} method="post" action="/api/apply">
        <FormItem required question="What is your preferred name?" index={0} key={0}>
          <TextInput required placeholder="Jane Doe" maxLength={1024} name="name" />
        </FormItem>
        <FormItem required question="How old are you?" index={1} key={1}>
          <TextInput required placeholder="13+" name="age" similarTextType="number" props={{ min: 13 }} />
        </FormItem>
        <FormItem required question="What is your Discord username?" index={2} key={2}>
          <TextInput required placeholder="wumpus0000" name="discord" maxLength={32} />
        </FormItem>
        <FormItem required question="What is your Minecraft username?" index={3} key={3}>
          <MCUsername />
        </FormItem>
        <FormItem required question="Do you have Minecraft Java Edition?" index={4} key={4}>
          <input required type="radio" id="mcjavayes" name="mcjava" />
          <label htmlFor="mcjavayes">Yes</label>
          <input required type="radio" id="mcjavano" name="mcjava" />
          <label htmlFor="mcjavano">No</label>
        </FormItem>
        <FormItem
          question={
            <>
              If you&apos;re a content creator, what platforms
              <br />
              would you post the CombinationSMP on? (Please provide links)
            </>
          }
          index={5}
          key={5}
        >
          <TextInput
            multiline
            placeholder="TikTok, YouTube, Instagram Reels, etc."
            name="social"
            maxLength={1024}
            multilineProps={{ rows: 2 }}
          />
        </FormItem>
        <FormItem required question="What activities do you do most in Minecraft?" index={6} key={6}>
          <TextInput required placeholder="Building, redstone, etc." name="activities" maxLength={1024} />
        </FormItem>
        <FormItem required question="Are you able to be active at least once a week?" index={7} key={7}>
          <input required type="radio" id="active-yes" name="active" />
          <label htmlFor="active-yes">Yes</label>
          <input required type="radio" id="active-no" name="active" />
          <label htmlFor="active-no">No</label>
        </FormItem>
        <FormItem required question="What timezone are you in?" index={8} key={8}>
          <TextInput required placeholder="PST, MST, CDT, EST, etc." name="timezone" maxLength={32} />
        </FormItem>
        <FormItem
          required
          question={
            <>
              What can you bring to our SMP?
              <br />
              How do you think you can add to the community?
              <br />
              <strong>Please write at least 2 sentences.</strong>
            </>
          }
          index={9}
          key={9}
        >
          <TextInput
            required
            multiline
            placeholder="Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos facilisi nascetur per consectetur quis urna."
            name="sentences"
            maxLength={2048}
            multilineProps={{
              rows: 6,
            }}
          />
        </FormItem>
        <FormItem question="How'd you hear about us?" index={10} key={10}>
          <TextInput placeholder="TikTok, Instagram, Disboard, etc." name="referral" maxLength={1024} />
        </FormItem>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SubmitButton>Submit</SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default Apply;
