import request from './request';

export let findAll = () => {
    return request({url:"gallery.json"})
        .then(data => data = JSON.parse(data))
}