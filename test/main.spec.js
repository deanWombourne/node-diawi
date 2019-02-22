const assert = require('assert');
const execSync = require('child_process').execSync;
const SEGUNDOS = 1000;

describe('command-line tests', function() {
  before(function() {
    this.timeout(10 * SEGUNDOS);
    execSync('npm link');
  });

  after(function() {
    this.timeout(10000);
    execSync('npm unlink');
  });

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('should return semver version number when called with --version', function() {
    const version = execSync('diawi --version').toString();
    const semverPattern = /^\d*\.\d*\.\d*\n$/;
    assert(version.toString().match(semverPattern), 'Versão: ' + version.toString());
  });

  it('should throw when called with no params', function() {
    assert.throws(() => {
      execSync('diawi');
    });
  });

  it('should throw when called with unrecognized param', function() {
    assert.throws(() => {
      execSync('diawi --qweqwe');
    });
  });

  it('should throw when called with unrecognized param', function() {
    assert.throws(() => {
      execSync('diawi --qweqwe');
    });
  });

  it('should accept a token and a file', function() {
    execSync('touch DIAWI_TEMP_FILE');
    try {
      execSync('diawi TOKEN DIAWI_TEMP_FILE --dry-run');
    } catch (err) {
      assert.fail('Threw exception');
    } finally {
      execSync('rm -f DIAWI_TEMP_FILE');
    }
  });
});
