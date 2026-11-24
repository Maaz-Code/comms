const getOtherEmail = (users, currentUser) => {
    if (!Array.isArray(users) || !currentUser?.email) return undefined;
    const currentEmail = currentUser.email.toLowerCase();
    return users.find(email => typeof email === "string" && email.toLowerCase() !== currentEmail);
}

export default getOtherEmail;
