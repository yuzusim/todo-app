import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./colors.js";

export default function App() {
  // 현재 Work인지 Travel인지 저장
  const [working, setWorking] = React.useState(true);

  // TextInput에 입력한 내용을 저장
  const [text, setText] = React.useState("");

  const [toDos, setToDos] = React.useState({});

  // Travel 버튼을 누르면 working을 false로 변경
  const travel = () => setWorking(false);

  // Work 버튼을 누르면 working을 true로 변경
  const work = () => setWorking(true);

  // TextInput에 입력할 때마다 입력값을 text에 저장
  const onChangeText = (payload) => setText(payload);

  // 키보드의 완료 버튼을 누르면 실행
  const addToDo = () => {
    // 입력값이 비어 있으면 함수 종료
    if (text === "") {
      return;
    }

    // 절대 state를 직접 수정하면 안됨
    // 기존 Todo에 새 Todo를 추가해서 새로운 객체 생성
    const newToDos = {
      ...toDos,

      // Date.now()를 Todo의 고유한 key로 사용
      [Date.now()]: { text, work: working },
    };

    // 새로운 Todo 목록을 state에 저장
    setToDos(newToDos);

    // 저장 후 입력창을 비움
    setText("");
  };
  console.log(toDos);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        // 완료 버튼을 누르면 addToDo 실행
        onSubmitEditing={addToDo}
        // 글자를 입력할 때마다 onChangeText 실행
        onChangeText={onChangeText}
        // 키보드의 Enter 버튼을 "완료"로 표시
        returnKeyType="done"
        // text state와 입력창을 연결
        value={text}
        style={styles.input}
        // Work / Travel에 따라 placeholder 변경
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
      />

      {/* Todo 목록을 스크롤할 수 있게 함 */}
      <ScrollView>
        {/* toDos의 key들을 가져와 하나씩 화면에 표시 */}
        {Object.keys(toDos).map((key) => (
          // Todo 하나를 감싸는 View
          <View style={styles.toDo} key={key}>
            {/* 해당 key의 Todo text를 화면에 표시 */}
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.grey,
    color: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
