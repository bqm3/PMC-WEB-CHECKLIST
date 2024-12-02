const BASE_URL_IMAGE="http://localhost:6868/upload"

export default function funcBaseUri_Image(key: any, image: any) {
  let uri = '';
  switch (key) {
    // checklist
    case 1:
      uri = `${BASE_URL_IMAGE}/checklist/${image}`;
      break;
    // báo cáo chỉ số
    case 2:
      uri = `${BASE_URL_IMAGE}/baocaochiso/${image}`;
      break;
    // sự cố ngoài
    case 3:
      uri = `${BASE_URL_IMAGE}/sucongoai/${image}`;
      break;
    default:
      uri ="";
      break;
  }
  return uri;
}

export function getImageUrls( key: any,item: any) {
  if (!item) return null;
  const image = item.endsWith('.jpg') || item.endsWith('.jpeg') || item.endsWith('.png')
  ? funcBaseUri_Image(key, item.trim())
  : `https://lh3.googleusercontent.com/d/${item.trim()}=s1000?authuser=0$`;
  console.log('image', image)
  return image;
}
