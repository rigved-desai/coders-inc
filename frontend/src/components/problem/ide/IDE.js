import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const IDE = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");


  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "cpp"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
  );
};
export default IDE;