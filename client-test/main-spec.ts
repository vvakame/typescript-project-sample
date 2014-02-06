///<reference path='libs/jasmine-1.2.0/jasmine-1.2.d.ts' />

module Test {
	describe("適当なテスト", ()=> {
		it("ほげほげ できること", () => {
			expect("ほげほげ").not.toBeNull();
		});
	});
}
