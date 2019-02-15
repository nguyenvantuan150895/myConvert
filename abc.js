let listener = {
    1: 'khoa1',
    2: 'khoa2',
    3: 'khoa3'
}

let arr = [1,2,3,4];

Object.keys(listener).map((page_num) => {
    console.log(page_num);
    console.log(listener[page_num]);
})

arr.map((value) => {
    console.log(value);
})