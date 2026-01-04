async function aiRewrite() {
  const text = editor.innerText;
  if(!text) return alert("Type something first!");
  const ai = firebase.functions().httpsCallable('aiRewrite');
  const res = await ai({ prompt: text });
  editor.innerText = res.data.text;
}
