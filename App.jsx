import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* Auth */
import SignUpScreen from "./src/auth/SignUpScreen";
import LoginScreen from "./src/auth/LoginScreen";
import RoleRedirect from "./src/auth/RoleRedirect";
import AuthLoading from "./src/auth/AuthLoading";

/* Teacher Screens */
import TeacherDashboard from "./src/teacher/TeacherDashboard";
import CreateQuiz from "./src/teacher/CreateQuiz";
import AddQuestions from "./src/teacher/AddQuestions";
import PerformanceDashboard from "./src/teacher/PerformanceDashboard";
import SendNotification from "./src/teacher/SendNotification";

/* Student Screens */
import StudentDashboard from "./src/student/StudentDashboard";
import QuizList from "./src/student/QuizList";
import QuizAttempt from "./src/student/QuizAttempt";
import ResultScreen from "./src/student/ResultScreen";
import Notifications from "./src/student/Notifications";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"   // ✅ IMPORTANT CHANGE
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* AUTO LOGIN CHECK */}
        <Stack.Screen name="AuthLoading" component={AuthLoading} />

        {/* AUTH */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="RoleRedirect" component={RoleRedirect} />

        {/* TEACHER */}
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
        <Stack.Screen name="AddQuestions" component={AddQuestions} />
        <Stack.Screen
          name="PerformanceDashboard"
          component={PerformanceDashboard}
        />
        <Stack.Screen
          name="SendNotification"
          component={SendNotification}
        />

        {/* STUDENT */}
        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboard}
        />
        <Stack.Screen name="QuizList" component={QuizList} />
        <Stack.Screen name="QuizAttempt" component={QuizAttempt} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
