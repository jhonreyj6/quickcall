import { default_image } from "./const";

export const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

export const csv = (data: string) => {
  const array = data.split(",");
  return array;
};

export const readableDate = (date: Date, month_format = "long") => {
  const date_setter = new Date(date);
  const options = { year: "numeric", month: month_format, day: "numeric" };
  const formattedDate = date_setter.toLocaleDateString("en-US", options);
  return formattedDate;
};

export const readableNumericDate = (date: Date) => {
  if (date) {
    const date_setter = new Date(date);
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = date_setter.toLocaleDateString("en-US", options);
    return formattedDate;
  }
};

export const hourAndMinuteDate = (date: Date) => {
  if (date) {
    const currentTime = new Date(date);
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes if needed

    const timeString = `${hours}:${formattedMinutes} ${amPm}`;

    return timeString;
  }
};

export const bottomReach = (element, callback) => {
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    callback();
  }
};

export const limitText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export const displayProjectImage = (user_id: number, img: string, project_id: number) => {
  return `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/users/${user_id}/projects/${project_id}/images/${img}`;
};

export const displayAttachmentProposal = (user_id: number, job_id: number, file_name: string) => {
  return `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/users/${user_id}/jobs/${job_id}/proposals/attachments/${file_name}`;
};

export const displayUserImage = (user_id: number, img: string) => {
  if (img) {
    if (img.includes("facebook") || img.includes("googleusercontent")) {
      return img;
    }
  }
  if (img) {
    return `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/users/${user_id}/images/avatar/${img}`;
  } else {
    return default_image;
  }
};

export const getMimeType = (name) => {
  return name.split(".").pop();
};

export function hasSearchParams() {
  const urlObj = new URL(window.location.href);
  return urlObj.searchParams.toString().length > 0 ? true : false;
}

//
export function arrayToObject(obj) {
  const result = {};

  for (const key in obj) {
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const parent = match[1];
      const child = match[2];
      result[parent] = result[parent] || {};
      result[parent][child] = obj[key];
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

export function urlParamsToObject() {
  const queryParams = new URLSearchParams(window.location.search);

  const result = {};
  for (const [key, value] of queryParams.entries()) {
    result[key] = value;
  }
  return result;
}

export function scrollToTopInstant() {
  window.scrollTo(0, 0);
}

export function getFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase();
}

// export const togglePassword = (element) => {
//   if(element.getAttribute("type") == "password") {
//     element.setAttribute("type", "text");
//   } else {
//     element.setAttribute("type", "password");
//   }
// }

export function removeObjectKeys(obj: object, keysToRemove: string[]) {
  const result = { ...obj }; // clone to avoid mutation

  keysToRemove.forEach((key) => {
    if (key in result) {
      delete result[key];
    }
  });

  return result;
}
