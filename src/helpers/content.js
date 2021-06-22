export const monsterNames = ["Birdy Boss","Casper Spray","Hit Woman","Aqua Coach","Thunder Kid","Mad Sauce","Octo Crush","Shady Stick","Sawft Ball","Hippie Puns","King Cyborg"]

export const monsterImages = [
    "https://blush.design/api/download?shareUri=I-RI7TbzIOQP7-rc&c=Skin_0%7Efd8800&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=EbvZIUvQiGIwT82T&c=Skin_0%7E00d2dc&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=MetU3cmttp6SXjsH&c=Skin_0%7Eacff00&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=IzJmjRnWbmhZp4d9&c=Skin_0%7E0099a3&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=1m-Pb5NHc30PevgO&c=Skin_0%7E7c6bba&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=1oZiY75RzrYnDy83&c=Skin_0%7Effcf00&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=rcIg6q5bkeOg4dao&c=Skin_0%7E00d2dc&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=NAmV5SxVJBTSJJ31&c=Skin_0%7Ef45675&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=-yvhHgBFZudAzkzT&c=Skin_0%7Efd8800&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=Nz2iPIPUFwjCjbe3&c=Skin_0%7Ef45675&w=800&h=800&fm=png",
    "https://blush.design/api/download?shareUri=CAXReDx4hsb40oN4&c=Skin_0%7Eacff00&w=800&h=800&fm=png"
]

export const getMonsterName = (monsterId) => {
    return monsterNames[monsterId]
}

export const getmonsterImage = (monsterId) => {
    return monsterImages[monsterId]
}

export const getRandomMonster = () => {
    const min = 1;
    const max = 10;
    const mediaID =  min + Math.floor(Math.random() * (max - min));
    return mediaID;
}