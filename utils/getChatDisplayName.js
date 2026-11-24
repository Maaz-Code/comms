export default function getChatDisplayName(displayNames, email) {
    const name = displayNames?.[email.toLowerCase()];
    return typeof name === "string" && name ? name : email.split("@")[0];
}
