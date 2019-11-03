const { get } = require('dot-prop');
const got = require('got');

module.exports = async (req, res) => {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Headers', 'Vary');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      errors: [{ message: 'ID is required' }],
    }));
  }

  const url = `https://player.vimeo.com/video/${id}/config`;
  const { request } = await got(url, { json: true }).then((d) => d.body);

  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(get(request, 'files.progressive', []).map((d) => ({
    width: d.width,
    height: d.height,
    url: d.url,
    mime: d.mime,
  }))));
};
