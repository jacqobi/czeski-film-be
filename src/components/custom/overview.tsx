import { motion } from "framer-motion";
import { MessageCircle, BotIcon } from "lucide-react";
import { CoBaIcon } from "./icons";
import { User } from "@/interfaces/interfaces";
export const Overview = ({ user }: { user: User }) => {
  return (
    <>
      <motion.div
        key="overview"
        className="max-w-3xl mx-auto md:mt-20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.75 }}
      >
        <div className="max-w-3xl mx-auto md:mt-20 rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
          <p className="flex flex-row justify-center items-center">
            <CoBaIcon />
          </p>
          <p className="flex flex-row justify-center items-center">
            <BotIcon size={44} />
            <span>+</span>
            <MessageCircle size={44} />
          </p>
          <p>
            Hello, {user.fullName}!<br />
            Welcome to <strong>RedHat DevOps AI</strong>
            <br />
            a simple tool to manage your servers and more made by
            <br />
            <strong>Prague DCBI team</strong>.
            <br />
            Just ask me what can I do
          </p>
        </div>
      </motion.div>
    </>
  );
};
