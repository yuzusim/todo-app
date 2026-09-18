import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors.js";

// AsyncStorage에서 Todo를 저장/불러올 때 사용할 이름
const STORAGE_KEY = "@toDos";

export default function App() {
  // 현재 Work인지 Travel인지 저장
  const [working, setWorking] = React.useState(true);

  // TextInput에 입력한 내용을 저장
  const [text, setText] = React.useState("");

  // Todo 목록을 저장
  // 처음에는 빈 객체로 시작
  const [toDos, setToDos] = React.useState({});

  // 컴포넌트가 처음 화면에 나타날 때 한 번 실행
  // 저장되어 있던 Todo를 불러옴
  useEffect(() => {
    loadToDos();
  }, []);

  // Travel 버튼을 누르면 working을 false로 변경
  const travel = () => setWorking(false);

  // Work 버튼을 누르면 working을 true로 변경
  const work = () => setWorking(true);

  // TextInput에 입력할 때마다 입력값을 text에 저장
  const onChangeText = (payload) => setText(payload);

  // Todo를 AsyncStorage에 저장하는 함수
  // async → 비동기 작업을 하는 함수
  const saveToDos = async (toSave) => {
    // Storage에 데이터를 저장
    // AsyncStorage는 문자열만 저장할 수 있기 때문에
    // 객체인 toSave를 JSON 문자열로 변환해서 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  // AsyncStorage에 저장되어 있는 Todo를 불러오는 함수
  const loadToDos = async () => {
    // Storage에서 @toDos라는 이름의 데이터를 가져옴
    // 가져오는 작업이 끝날 때까지 기다림
    const s = await AsyncStorage.getItem(STORAGE_KEY);

    // 가져온 문자열을 JavaScript 객체로 다시 변환
    // 변환한 데이터를 toDos state에 저장
    setToDos(JSON.parse(s));
  };

  // 키보드의 완료 버튼을 누르면 실행
  const addToDo = async () => {
    // 입력값이 비어 있으면 함수 종료
    if (text === "") {
      return;
    }

    // 절대 state를 직접 수정하면 안됨
    // 기존 Todo에 새 Todo를 추가해서 새로운 객체 생성
    const newToDos = {
      // 기존 Todo들을 새로운 객체에 복사
      ...toDos,

      // Date.now()를 Todo의 고유한 key로 사용
      // { text: text, working: working }에서
      // key와 변수 이름이 같기 때문에 { text, working }으로 줄여서 작성
      [Date.now()]: { text, working },
    };

    // 새로운 Todo 목록을 state에 저장
    // 화면에 바로 새로운 Todo가 나타남
    setToDos(newToDos);

    // 새로운 Todo 목록을 Storage에도 저장
    // 앱을 꺼도 데이터가 남아 있음
    await saveToDos(newToDos);

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
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            // Todo 하나를 감싸는 View
            <View style={styles.toDo} key={key}>
              {/* 해당 key의 Todo text를 화면에 표시 */}
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View>
          ) : null,
        )}
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
