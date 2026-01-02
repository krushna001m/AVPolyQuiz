import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getData } from "./quizService";

/**
 * Login using ERP + (email or mobile) + password.
 * Returns merged object: { uid, ...userData }.
 */
export const loginStudentOrTeacher = async (
    erpNo,
    identifier,
    password
) => {
    // identifier can be email or mobile
    const users = await getData("users");
    if (!users) {
        throw new Error("No users found");
    }

    let matchedUser = null;
    let matchedUid = null;

    for (const uid in users) {
        const user = users[uid];
        if (
            user.erpNo === erpNo &&
            (user.email === identifier || user.mobile === identifier)
        ) {
            matchedUser = user;
            matchedUid = uid;
            break;
        }
    }

    if (!matchedUser) {
        throw new Error("Invalid ERP number or Gmail/Mobile");
    }

    // 🔐 Login using EMAIL internally
    await signInWithEmailAndPassword(auth, matchedUser.email, password);

    return { uid: matchedUid, ...matchedUser };
};
